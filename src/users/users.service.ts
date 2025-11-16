import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  // Get all users (Admin only)
  async findAll({ page = 1, limit = 10, search }: any) {
    const query: any = { deleted: false };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.userModel.find(query).skip(skip).limit(+limit).exec(),
      this.userModel.countDocuments(query),
    ]);

    return {
      items,
      total,
      page: +page,
      limit: +limit,
    };
  }

  // Get logged-in user
  async findById(id: string) {
    const user = await this.userModel
      .findById(id)
      .where({ deleted: false });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // Update logged-in user profile
  async updateProfile(id: string, data: any) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const updated = await this.userModel.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!updated) {
      throw new NotFoundException('User not found');
    }

    return updated;
  }

  // Soft delete (mark user as deleted)
  async softDelete(id: string) {
    const deleted = await this.userModel.findByIdAndUpdate(
      id,
      { deleted: true },
      { new: true },
    );

    if (!deleted) {
      throw new NotFoundException('User not found');
    }

    return { message: 'Account deleted successfully' };
  }
}
