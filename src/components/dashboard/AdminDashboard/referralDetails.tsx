export default function ReferralDetails({
  selectedUser,
}: {
  selectedUser: any;
}) {
  return (
    <div>
      {selectedUser ? (
        <div>
          <h2 className="text-lg font-semibold mb-2">
            Referred Users by {selectedUser.name}
          </h2>
          {selectedUser.referred_users && selectedUser.referred_users.length > 0 ? (
            <ul className="space-y-2">
              {selectedUser.referred_users.map(
                (refUser: { name: string; email: string }, index: number) => (
                  <li
                    key={index}
                    className="p-2 border rounded-md shadow-sm bg-gray-50"
                  >
                    <p className="font-medium">{refUser.name}</p>
                    <p className="text-sm text-gray-600">{refUser.email}</p>
                  </li>
                )
              )}
            </ul>
          ) : (
            <p className="text-gray-500">No referred users</p>
          )}
        </div>
      ) : (
        <p>No user selected</p>
      )}
    </div>
  );
}
