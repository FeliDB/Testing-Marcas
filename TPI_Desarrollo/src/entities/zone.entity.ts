import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { locationEntity } from './location.entity';
import { deliveryEntity } from './delivery.entity';

@Entity('zone')
export class zoneEntity {
  @PrimaryGeneratedColumn()
  idZone: number;

  @Column()
  name: string;

  @Column()
  radius: number;

  @ManyToOne(() => locationEntity)
  @JoinColumn({ name: 'location' })
  location: locationEntity;

  @ManyToMany(() => deliveryEntity, {nullable: true})
  @JoinTable()
  deliveries: deliveryEntity[]
}