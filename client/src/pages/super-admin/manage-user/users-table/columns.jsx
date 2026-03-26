
export const columns = [
  {
    accessorKey: "name",
    header: "USERS",
    cell: ({ row }) => {
      const user = row.original

      return (
        <div className="flex gap-4 items-center">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold p-1 bg-gold text-white">
            {user.initials}
          </div>
          <div>
            <p>{user.name}</p>
            <p className="text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "role",
    header: "ROLE",
    cell: ({ row }) => {
      const role = row.getValue("role")

      const ROLE_COLOR = {
        "Brand manager": "bg-teal-100  border-teal-200 text-teal-700",
        "DC operator": "bg-orange-100  border-orange-200 text-orange-700",
        "Store manager": "bg-yellow-100  border-yellow-200 text-yellow-700",
      }

      return (
        <span className={`${ROLE_COLOR[role]} inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border`}>
          {role}
        </span>
      )
    },
  },
  {
    accessorKey: "brand",
    header: "BRAND",
  },
  {
    accessorKey: "scope",
    header: "SCOPE",
  },
  {
    accessorKey: "lastLogin",
    header: "LAST LOGIN",
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => {
      const status = row.getValue("status")

      const STATUS_COLOR = {
        active: "bg-green-100  border-green-200 text-green-700",
        inactive: "bg-red-100  border-red-200 text-red-700",
        // pending: "bg-yellow-100 border border-yellow-600 text-yellow-600",
      }

      return (
        
        <span className={`${STATUS_COLOR[status]} inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border`}>
          {status}
        </span>
      )
    },
  },
]