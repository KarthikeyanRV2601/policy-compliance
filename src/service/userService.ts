import { requestApi } from "./utils";

class UserService {
    static async getUser() {
        return await requestApi("/user/user");
    }
}

export default UserService;