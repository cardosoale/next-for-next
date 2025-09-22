import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from 'src/user/entities/user.entity';
import { PostResponseDto } from './dto/post-response.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async create(dto: CreatePostDto, author: User): Promise<PostResponseDto> {
    const post = this.postRepository.create({
      slug: 'kfeufhnfuhuv' + Math.random().toString(36).substring(2, 8),
      title: dto.title,
      excerpt: dto.excerpt,
      content: dto.content,
      author,
    });

    const created = await this.postRepository.save(post);

    return new PostResponseDto(created);
  }
}
