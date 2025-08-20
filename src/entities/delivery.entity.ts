import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, JoinTable, ManyToMany } from 'typeorm';
import { zoneEntity } from './zone.entity';
import { locationEntity } from './location.entity';

@Entity('delivery')
export class deliveryEntity {
  @PrimaryGeneratedColumn()
  idDelivery: number;

  @Column()
  personId: number;

  @Column('float')
  radius: number;

  @Column({default: "avaliable"})
  status: string;

  @ManyToMany(() => zoneEntity, {nullable: true})
  @JoinTable()
  zones: zoneEntity[]

  @ManyToOne(() => locationEntity, )
  @JoinColumn({ name: 'location' })
  location: locationEntity;
}
