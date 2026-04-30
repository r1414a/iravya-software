
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { KeyRound, Pencil } from "lucide-react"
import DeleteModal from "@/components/DeleteModal"
import { ROLES, STATUS } from "@/constants/constant"
import { formatDistanceToNow, parseISO } from "date-fns"
import { useDeleteUserMutation } from "@/lib/features/users/userApi"
import EditPasswordModal from "../EditPasswordModal"
import { getNameInitials } from "@/lib/utils/helperFunctions"

function ActionsCell({ row, table }) {
  const user = row.original;
  
  // const [editUser, setEditUser] = useState(false);
  const [password, setPassword] = useState(false);

  const { setEditUser, setEditOpen } = table.options.meta || {}

  const [deleteStore, { isLoading: isDeleting }] = useDeleteUserMutation()
  const handleDelete = async () => {
    try {
      await deleteStore(user.id).unwrap();
    } catch (err) {
      console.error("Failed to delete user", err);
    }
  };
  return (
    <>


      <EditPasswordModal
        user={user}
        open={password}
        onClose={setPassword}
      />

      <div className="flex items-center gap-2 justify-end">

        {
          user.role !== 'driver' && (
            <Button variant="outline" size="xs" onClick={() => setPassword(true)} className="hover:bg-maroon cursor-pointer text-blue-800 hover:text-white"><KeyRound size={16} /></Button>
          )
        }

        <Button
          variant="outline"
          size="xs"
          onClick={() => {
            setEditUser?.(user)
            setEditOpen?.(true)
          }}
          className="hover:bg-maroon cursor-pointer text-blue-800 hover:text-white"><Pencil size={16} /></Button>

        <DeleteModal
          who={`${user.first_name} ${user.last_name}`}
          m1active="User will immediately lose access to the platform"
          onConfirm={handleDelete}
          isLoading={isDeleting}
        />



      </div>
    </>
  )
}

export const columns = [
  {
    accessorKey: "name",
    header: "USERS",
    cell: ({ row }) => {
      const user = row.original

      return (
        <div className="flex gap-4 items-center">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold p-1 bg-gold text-white">
            {getNameInitials(user.first_name, user.last_name)}
          </div>
          <div>
            <p>{user.first_name} {user.last_name}</p>
            <p className="text-sm text-muted-foreground">
              {user.role === 'driver' ? `+91 ${user.phone_number}` : user.email}
            </p>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "role",
    header: ({ column, table }) => {
      const current = column.getFilterValue() || "all";
      return (
        <div className="flex items-center gap-2">
          <span>Role</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-6 min-w-18 text-[10px]"
              >
                {current === "all" ? "All" : ROLES[current].text}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40 bg-white border shadow-md">
              <DropdownMenuRadioGroup
                value={current}
                onValueChange={(val) => {
                  column.setFilterValue(val === "all" ? undefined : val)
                  table.options.meta?.updatePage?.(1)

                }
                }
              >
                <DropdownMenuRadioItem value="all" className="text-xs">
                  All roles
                </DropdownMenuRadioItem>
                {Object.entries(ROLES).map(([key, value]) => (
                  <DropdownMenuRadioItem key={key} value={key} className="text-xs">
                    {value.text}
                  </DropdownMenuRadioItem>
                ))
                }
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
    cell: ({ row }) => {
      const role = row.getValue("role")
      return (
        <span className={`${ROLES[role.toLowerCase()].color} inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border`}>
          {ROLES[role].text}
        </span>
      )
    },
    filterFn: (row, id, value) =>
      !value || row.getValue(id).toLowerCase() === value.toLowerCase(),
  },
  {
    accessorKey: "scope",
    header: "SCOPE",
    cell: ({ row }) => {
      const scope = row.getValue("scope");
      if (!scope) return <span className="text-gray-400">-</span>

      return (
        <p className="text-gray-600 capitalize">{scope}</p>
      )
    }
  },
  {
    accessorKey: "last_login",
    header: "LAST LOGIN",
    cell: ({ row }) => {
      const lastLogin = row.getValue("last_login");
      // console.log(lastLogin);

      if (!lastLogin) return <span className="text-gray-400 text-center">-</span>

      const relativeTime = formatDistanceToNow(parseISO(lastLogin), {
        addSuffix: true
      })

      return (
        <p className="text-gray-600 capitalize">{relativeTime.replace('about', '')}</p>
      )
    }
  },
  {
    accessorKey: "user_status",
    header: ({ column, table }) => {
      const currentValue = column.getFilterValue() || "all";

      // console.log("user_status",currentValue);


      return (
        <div className="flex items-center gap-2">
          <span>Status</span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-6 min-w-18 text-[10px]">
                {currentValue === "all"
                  ? "All"
                  : currentValue === "inactive"
                    ? "In active"
                    : currentValue.charAt(0).toUpperCase() + currentValue.slice(1)}
              </Button>
              {/* <Filter size={16} fill="#701a40" stroke=" #701a40" /> */}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-36 bg-white border shadow-md">
              <DropdownMenuRadioGroup
                value={currentValue}
                onValueChange={(value) => {
                  column.setFilterValue(
                    value === "all" ? undefined : value
                  )
                  table.options.meta?.updatePage?.(1)
                }}
              >
                <DropdownMenuRadioItem value="all" className="text-xs">
                  All
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="active" className="text-xs">
                  Active
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="inactive" className="text-xs">
                  In active
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
    cell: ({ row }) => {
      const s = row.original.user_status
      return (
        <span className={`${STATUS[s].color} inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border`}>
          {STATUS[s].text}
        </span>
      )
    },
    filterFn: (row, id, value) => {

      if (!value) return true
      return row.getValue(id) === value
    }
  },
  {
    id: "actions",
    cell: ({ row, table }) => <ActionsCell row={row} table={table} />,
  },
]