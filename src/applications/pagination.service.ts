import {Injectable} from "@nestjs/common";
import {HydratedDocument} from "mongoose";
import {getSortNumber} from "../utils/sort";

type ResponseData = {
    doc: HydratedDocument<any> | any,
    pageSize: number,
    pageNumber: number,
    count: number
}

@Injectable()
export class PaginationService {
    async create(query, model: any, projection= {}, filter = {}): Promise<ResponseData> {
        const {sortBy, sortDirection, pageNumber, pageSize} = query;
        const sortNumber = getSortNumber(sortDirection);
        const skipNumber = (pageNumber - 1) * pageSize;
        const count = await model.countDocuments(filter);
        const doc = await model.find(filter, projection)
            .sort({ [sortBy]: sortNumber })
            .skip(skipNumber)
            .limit(pageSize);
        return {
            doc,
            pageSize,
            pageNumber,
            count
        }
    }
    async createLean(query, model: any, projection= {}, filter = {}): Promise<ResponseData> {
        const {sortBy, sortDirection, pageNumber, pageSize} = query;
        const sortNumber = getSortNumber(sortDirection);
        const skipNumber = (pageNumber - 1) * pageSize;
        const count = await model.countDocuments(filter);
        const doc = await model.find(filter, projection)
            .sort({ [sortBy]: sortNumber })
            .skip(skipNumber)
            .limit(pageSize)
            .lean();
        return {
            doc,
            pageSize,
            pageNumber,
            count
        }
    }
}