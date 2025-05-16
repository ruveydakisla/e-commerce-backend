import { UserRole } from 'src/utils/types';
import { Column, Entity } from 'typeorm';
import { BaseEntityWithName } from './BaseEntityWithName';
@Entity('users')
export class User extends BaseEntityWithName {
  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;
  @Column({ type: 'varchar', length: 150, unique: true })
  password: string;
  @Column({ name: 'is_active', type: 'boolean', default: false })
  isActive: boolean;
  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;
  @Column({ type: 'timestamp', nullable: true })
  birthdate: Date;
  constructor(userDTO: Partial<User>) {
    super();
    Object.assign(this, { ...userDTO });
  }
}
