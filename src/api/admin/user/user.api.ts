import api from "../../index";

export class UserApi {
    getUserList = () => {
        return api({
            method: "GET",
            url: "/admin/users",
        })
            .then((response) => response.data)
            .catch((err) => Promise.reject(err));
    };

    deleteUser = (id: number) => {
        return api({
            method: "DELETE",
            url: `/admin/users/${id}`,
        })
            .then((response) => response.data)
            .catch((err) => Promise.reject(err));
    };

    fetchUser = (id: number) => {
        return api({
            method: "GET",
            url: `/admin/users/${id}`,
        })
            .then((response) => response.data)
            .catch((err) => Promise.reject(err));
    };
}
