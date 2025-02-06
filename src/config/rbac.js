const roles = {
    user: {
        can: ['view_wallet', 'initiate_transaction'],
    },
    vendor: {
        can: ['view_wallet', 'credit_wallet', 'debit_wallet', 'view_transactions'],
    },
    admin: {
        can: ['manage_users', 'view_all_transactions'],
    },
};

const checkPermission = (role, action) => {
    if (!roles[role]) return false;
    return roles[role].can.includes(action);
};

// export default {
//     roles,
//     checkPermission,
// };

module.exports = {
    roles,
    checkPermission,
};