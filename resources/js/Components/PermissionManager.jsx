import { useState, useEffect } from "react";

const permissionsList = [
  "View user", "Create user", "Edit user", "Delete user", "Export user",
  "View company", "Create company", "Edit company", "Delete company", "Export company",
  "View employee", "Create employee", "Edit employee", "Delete employee", "Export employee",
  "View loan", "Create loan", "Edit loan", "Delete loan", "Export loan",
  "View loan provider", "Create loan provider", "Edit loan provider", "Delete loan provider", "Export loan provider",
  "View notification", "Create notification", "Edit notification", "Delete notification", "Export notification",
  "View remittance", "Create remittance", "Edit remittance", "Delete remittance", "Export remittance",
  "View repayments", "Create repayments", "Edit repayments", "Delete repayments", "Export repayments",
];

// Function to group permissions dynamically
const groupPermissions = () => {
  const groups = {};
  permissionsList.forEach((perm) => {
    const parts = perm.split(" ");
    const entity = parts.slice(1).join(" "); // Extract entity name (e.g., "user", "company")
    if (!groups[entity]) {
      groups[entity] = [];
    }
    groups[entity].push(perm);
  });
  return groups;
};

const PermissionManager = ({ selectedPermissions, onUpdate }) => {
  const [formData, setFormData] = useState(selectedPermissions);
  const permissionGroups = groupPermissions();

  const handlePermissionChange = (permission) => {
    setFormData((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission) // Remove if already selected
        : [...prev, permission] // Add if not selected
    );
  };

  useEffect(() => {
    onUpdate(formData);
  }, [formData, onUpdate]);

  return (
    <div className="max-w-4xl mt-10 p-4 shadow-md rounded-md mb-6 bg-white">
      <h5 className="text-lg font-semibold mb-4">Customize User Permissions</h5>
      {Object.entries(permissionGroups).map(([group, permissions]) => (
        <div key={group} className="mb-6 flex flex-col">
          <h5 className="text-md font-medium capitalize text-gray-700 mb-2">{group}</h5>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {permissions.map((permission) => (
              <label key={permission} className="flex flex-wrap items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  id={permission}
                  value={permission}
                  checked={formData.includes(permission)}
                  onChange={() => handlePermissionChange(permission)}
                  className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500 rounded"
                />
                <span className="text-gray-800">{permission}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PermissionManager;