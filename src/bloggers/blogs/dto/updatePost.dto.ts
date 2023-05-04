import {OmitType} from "@nestjs/mapped-types";
import {PostInputModelDto} from "../../../posts/dto";

export class UpdatePostDto extends OmitType(PostInputModelDto, ['blogId'] as const) {}