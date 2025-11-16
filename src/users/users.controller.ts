import {
    Controller,
    Get,
    UseGuards,
    Put,
    Body,
    Delete,
    Query,
    Post,
    UploadedFile,
    UseInterceptors,
  } from '@nestjs/common';
  import { UsersService } from './users.service';
  import { AuthGuard } from '@nestjs/passport';
  import { CurrentUser } from '../common/decorators/current-user.decorator';
  import { UpdateUserDto } from './dto/update-user.dto';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { diskStorage } from 'multer';
  import { v4 as uuidv4 } from 'uuid';
  
  @Controller('users')
  export class UsersController {
    constructor(private usersService: UsersService) {}
  
    // 1. Get all users (Admin only)
    @UseGuards(AuthGuard('jwt'))
    @Get()
    async getAll(
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 10,
      @Query('search') search?: string,
      @CurrentUser() user?: any,
    ) {
      if (!user.isAdmin) {
        return { success: false, message: 'Only admin can view all users' };
      }
      return this.usersService.findAll({ page, limit, search });
    }
  
    // 2. Get logged-in user profile
    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    async getProfile(@CurrentUser() user: any) {
      return this.usersService.findById(user.userId);
    }
  
    // 3. Update logged-in user profile
    @UseGuards(AuthGuard('jwt'))
    @Put('update')
    async updateProfile(
      @CurrentUser() user: any,
      @Body() updateDto: UpdateUserDto,
    ) {
      return this.usersService.updateProfile(user.userId, updateDto);
    }
  
    // 4. Soft delete account
    @UseGuards(AuthGuard('jwt'))
    @Delete('delete')
    async softDelete(@CurrentUser() user: any) {
      return this.usersService.softDelete(user.userId);
    }
  
    // 5. Upload profile picture
    @UseGuards(AuthGuard('jwt'))
    @Post('upload')
    @UseInterceptors(
      FileInterceptor('avatar', {
        storage: diskStorage({
          destination: './uploads',
          filename: (req, file, cb) => {
            const ext = file.originalname.split('.').pop();
            const filename = `${uuidv4()}.${ext}`;
            cb(null, filename);
          },
        }),
      }),
    )
    async uploadAvatar(
      @CurrentUser() user: any,
      @UploadedFile() file: Express.Multer.File,
    ) {
      return this.usersService.updateProfile(user.userId, {
        avatar: file.filename,
      });
    }
  }