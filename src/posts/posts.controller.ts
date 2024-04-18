import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostDto } from './dto/post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { GetUser } from '@app/common/decorator/getUser.decorator';
import { User } from '@app/users/entities/user.entity';
import { JwtAuthGuard } from '@app/auth/guards/jwt-auth.guard';
import { UserDto } from '@app/users/dto/user.dto';
import { Pagination } from '@app/common/interface/pagination.interface';
import { findAllQueryDto } from '../common/dto/findAllQuery.dto';

@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async create(@Body() createPostDto: PostDto, @GetUser() loginUser: User) {
    return await this.postsService.create({...createPostDto, user:loginUser});
  }

  @Post('list')
  async findAll(@Body() queryDto:findAllQueryDto) {
    const postQuery = new findAllQueryDto(queryDto);
    const { filter, pagination, sort } = postQuery;
    return await this.postsService.findAll({filter, pagination, sort});
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const post = await this.postsService.findOne({id:id});
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    const findPost = await this.postsService.findOne({id:id});

    if (!findPost) {
      throw new NotFoundException('Post not found');
    }
    return await this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const findPost = await this.postsService.findOne({id:id});

    if (!findPost) {
      throw new NotFoundException('Post not found');
    }
    return await this.postsService.remove(id);
  }
}
