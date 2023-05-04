import {BlogsInputModelDTO} from "../../../../blogs/dto";
import {Users} from "../../../../users/users.schema";

export class CreateBlogCommand {
    constructor(public blogDto: BlogsInputModelDTO, public user: Users) {}
}