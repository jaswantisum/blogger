import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentDto } from './dto/comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ParseIntPipe } from '@nestjs/common';
import { PostsService } from '../posts.service';
import { NotFoundException } from '@nestjs/common';
import { PostDto } from '../dto/post.dto';
import { GetUser } from '@app/common/decorator/getUser.decorator';
import { User } from '@app/users/entities/user.entity';
import { JwtAuthGuard } from '@app/auth/guards/jwt-auth.guard';
import { Pagination } from '@app/common/interface/pagination.interface';

//  implement JwtGuard On Controller
@UseGuards(JwtAuthGuard)
@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly postsService: PostsService,
  ) {}

  @Post()
  async create(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() createCommentDto: CommentDto,
  ) {
    const findPost = await this.postsService.findOne(postId);
    if (!findPost) throw new NotFoundException('Post not found');
    const comment = await this.commentsService.create({
      ...createCommentDto,
      post: { id: postId } as PostDto,
    });

    return comment;
  }

  @Get()
  async findAll(
    @Param('postId', ParseIntPipe) postId: number,
    @Query() paginationDto: Pagination,
  ) {
    const comments = await this.commentsService.findAll(
      {
        post: { id: postId },
      },
      paginationDto,
    );
    return comments;
  }

  @Get(':id')
  async findOne(
    @Param('postId', ParseIntPipe) postId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    // check if the comment is belongs with the post
    const postComment = await this.commentsService.findOne({
      id,
      post: { id: postId },
    });
    // Error: comment not found
    if (!postComment) throw new NotFoundException('Comment not found');
    return await this.commentsService.findOne({ id, post: { id: postId } });
  }

  @Patch(':id')
  async update(
    @Param('postId', ParseIntPipe) postId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    // check if the comment is belongs with the post
    const postComment = await this.commentsService.findOne({
      id,
      post: { id: postId },
    });
    // Error: comment not found
    if (!postComment) throw new NotFoundException('Comment not found');

    // update the comment
    return await this.commentsService.update(id, updateCommentDto);
  }

  @Delete(':id')
  async remove(
    @Param('postId', ParseIntPipe) postId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    // check if the comment is belongs with the post
    const postComment = await this.commentsService.findOne({
      id,
      post: { id: postId },
    });
    // Error: comment not found
    if (!postComment) throw new NotFoundException('Comment not found');
    return await this.commentsService.remove(id);
  }
}
