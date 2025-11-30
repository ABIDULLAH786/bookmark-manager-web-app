const createApiResource = (base: string) => ({
    LIST: () => ({ url: base, method: "GET" }),
    CREATE: () => ({ url: base, method: "POST" }),
    DETAIL: (id: string) => ({ url: `${base}/${id}`, method: "GET" }),
    UPDATE: (id: string) => ({ url: `${base}/${id}`, method: "PUT" }),
    DELETE: (id: string) => ({ url: `${base}/${id}`, method: "DELETE" }),
    PATCH: (id: string) => ({ url: `${base}/${id}`, method: "PATCH" }),
    NESTED: (nestedName: string) => createApiResource(`${base}/${nestedName}`), // for nested paths
});

export const API_PATHS = {
    FOLDERS: createApiResource("/api/folders"),
    BOOKMARKS: createApiResource("/api/bookmarks"),
    USERS: createApiResource("/api/users"),
};
