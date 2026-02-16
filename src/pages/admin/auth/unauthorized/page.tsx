export default function Unauthorized() {
  return (
    <div className="min-h-[100svh] bg-white flex justify-center items-center">
      <div>
        <h1 className="text-center text-red-600 font-bold">
          Eroror 401 - Unauthorized: Access blocked
        </h1>
        <p className="text-sm text-center">You do not have permission to view this page</p>
      </div>
    </div>
  );
}
