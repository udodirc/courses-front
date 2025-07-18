import api from "../../index.ts";

export class RoleApi {
    getRoleList = () => {
        return api({
            method: "GET",
            url: "/admin/roles",
        })
            .then((response) => response.data)
            .catch((err) => Promise.reject(err));
    };
    fetchRole = (id: number) => {
        return api({
            method: "GET",
            url: `/admin/roles/${id}`,
        })
            .then((response) => response.data)
            .catch((err) => Promise.reject(err));
    };

    createRole = (data: { name: string; }) => {
        return api({
            method: "POST",
            url: "/admin/roles",
            data,
        })
            .then((response) => response.data)
            .catch((err) => Promise.reject(err));
    };

    deleteRole = (id: number) => {
        return api({
            method: "DELETE",
            url: `/admin/roles/${id}`,
        })
            .then((response) => response.data)
            .catch((err) => Promise.reject(err));
    };
}