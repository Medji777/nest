import {BlogsInputModelDTO} from "../../../../blogs/dto";

export class UpdateBlogCommand {
    constructor(public id: string, public userId: string, public bodyDTO: BlogsInputModelDTO) {}
}