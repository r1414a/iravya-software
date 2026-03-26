
export const columns = [
  {
    accessorKey: "name",
    header: "USERS",
    cell: ({ row }) => {
      const user = row.original

      return (
        <div className="flex gap-4 items-center">
          <div className="rounded-full p-1 bg-gold font-bold text-white">
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
        "Brand manager": "bg-teal-100 border border-teal-600 text-teal-600",
        "DC operator": "bg-orange-100 border border-orange-600 text-orange-600",
        "Store manager": "bg-yellow-100 border border-yellow-600 text-yellow-600",
      }

      return (
        <span className={`${ROLE_COLOR[role]} px-2 py-1 rounded text-xs`}>
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
        active: "bg-green-100 border border-green-600 text-green-600",
        inactive: "bg-red-100 border border-red-600 text-red-600",
        // pending: "bg-yellow-100 border border-yellow-600 text-yellow-600",
      }

      return (
        <span className={`${STATUS_COLOR[status]} px-2 py-1 rounded text-xs`}>
          {status}
        </span>
      )
    },
  },
]