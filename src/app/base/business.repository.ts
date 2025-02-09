import {
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { isEmpty, isUndefined, omitBy } from 'lodash';
import { Model, FilterQuery, Types } from 'mongoose';
import { Basic } from 'src/app/base/basic.schema';
import { UserModel } from 'src/app/user/dto/user.dto';

export interface CustomSaveOptions {
  user?: UserModel;
}

export class BusinessRepository<Schema extends Basic> {
  constructor(private readonly model: Model<Schema>) {}

  async isExistOrFail(optionsOrConditions: FilterQuery<Schema>): Promise<void> {
    const count = await this.model.countDocuments(optionsOrConditions.where);

    if (count === 0) {
      throw new NotFoundException('is not exist');
    }
  }

  async findOne(
    optionsOrConditions: FilterQuery<Schema>,
  ): Promise<Schema | null> {
    const result = await this.model.findOne(optionsOrConditions).lean();

    return result as Schema;
  }

  async find(): Promise<Schema[]> {
    const result = await this.model.find().exec();

    return result;
  }

  async findOneOrFail(
    optionsOrConditions: FilterQuery<Schema>,
  ): Promise<Schema> {
    const result = await this.findOne(optionsOrConditions);

    if (!result) {
      throw new NotFoundException();
    }

    return result;
  }

  async createAndSave(
    data: Partial<Schema>,
    options?: CustomSaveOptions,
  ): Promise<Schema> {
    if (isEmpty(data)) {
      throw new BadRequestException();
    }

    const clearedData = omitBy(data, isUndefined);

    const savedEntity = await this.model.create({
      createdById: options.user ? options.user._id : null,
      ...clearedData,
    });

    return await this.findOne({ _id: savedEntity._id });
  }

  async updateById(
    id: Types.ObjectId,
    data: Partial<Schema>,
    options?: CustomSaveOptions,
  ): Promise<Schema> {
    if (isEmpty(data)) {
      throw new InternalServerErrorException('Invalid data to update');
    }

    const clearedData = omitBy(data, isUndefined);

    if (!id) {
      throw new BadRequestException('Invalid id');
    }

    await this.model
      .findByIdAndUpdate(id, {
        ...clearedData,
        updatedById: options.user ? options.user._id : null,
        updatedAt: new Date(),
      })
      .exec();

    return await this.findOne({ _id: id });
  }

  async softDelete(
    id: Types.ObjectId,
    options: CustomSaveOptions = {},
  ): Promise<void> {
    if (options.user) {
      await this.model
        .findByIdAndUpdate(id, {
          deletedById: options.user ? options.user._id : null,
        })
        .exec();
    }

    await this.model.findByIdAndUpdate(id, { deletedAt: new Date() }).exec();
  }
}
