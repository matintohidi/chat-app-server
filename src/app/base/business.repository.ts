import {
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { isEmpty, isUndefined, omitBy } from 'lodash';
import { UserDocument } from 'src/app/user/schemas/user.schema';
import { Model, FilterQuery } from 'mongoose';

export interface CustomSaveOptions {
  user?: UserDocument;
}

export class BusinessRepository<Schema> {
  constructor(private readonly model: Model<Schema>) {}

  async isExistOrFail(optionsOrConditions: FilterQuery<Schema>) {
    const count = await this.model.countDocuments(optionsOrConditions.where);
    if (count === 0) {
      throw new NotFoundException('is not exist');
    }
  }

  async findOne(
    optionsOrConditions: FilterQuery<Schema>,
  ): Promise<Schema | null> {
    const result = await this.model.findOne(optionsOrConditions.where).exec();

    return result;
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
      throw new InternalServerErrorException();
    }
    const clearedData = omitBy(data, isUndefined);

    const savedEntity = await this.model.create({
      ...clearedData,
      createdBy: options.user ? options.user._id : null,
    });

    return await this.findOne({ where: { _id: savedEntity.id } });
  }

  async updateById(
    id: string,
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
        createdBy: options.user ? options.user._id : null,
      })
      .exec();

    return await this.findOne({ where: { _id: id } });
  }

  async softDelete(id: string, options: CustomSaveOptions = {}): Promise<void> {
    if (options.user) {
      await this.model
        .findByIdAndUpdate(id, {
          deletedById: options.user ? options.user._id : null,
        })
        .exec();
    }
    await this.model.findByIdAndUpdate(id, { deleted: true }).exec();
  }
}
