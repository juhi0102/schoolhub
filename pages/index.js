import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-8 bg-white rounded-2xl shadow-lg text-center space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">School Management</h1>
        <p className="text-gray-600">Choose an option to continue</p>

        <div className="flex flex-col space-y-4">
          <Link href="/showSchools">
            <span className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold cursor-pointer shadow-md">
              Show Schools
            </span>
          </Link>
          <Link href="/addSchool">
            <span className="px-6 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold cursor-pointer shadow-md">
              Add School
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
