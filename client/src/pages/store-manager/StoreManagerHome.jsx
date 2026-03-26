import StoreManagerTasks from "./storeManagerTask"

export default function StoreManagerHome() {
  return (
    <div className="min-h-screen bg-linear-to-br from-[#701a40] to-[#5a1430] p-6">

      {/* Heading */}
      <div className="text-center mb-10">
        {/* <h1 className="text-3xl font-light text-white">
          Super Admin Dashboard
        </h1> */}
        <p className="text-white/70 mt-2">
          View, track trips and reporting
        </p>
      </div>

      {/* Super Admin Task In Card Grid */}
      <StoreManagerTasks/>
    </div>
  )
}