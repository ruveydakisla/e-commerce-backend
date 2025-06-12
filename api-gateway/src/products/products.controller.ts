import {
  CreateProductDTO,
  PaginationOptions,
  UpdateProductDTO,
  UserRole,
} from '@my/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/JwtAuth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CustomCacheInterceptor } from 'src/common/interceptors/cache.interceptor';
import { ProductsService } from './products.service';
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.SELLER)
  create(@Body() createProductDto: CreateProductDTO) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @UseInterceptors(CustomCacheInterceptor)
  findAll(@Query() query: PaginationOptions) {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  @UseInterceptors(CustomCacheInterceptor)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.SELLER)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDTO,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
