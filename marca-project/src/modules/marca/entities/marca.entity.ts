import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Marca {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column({type: 'timestamp', nullable: true})
    deletedAt: Date;

    @Column({type: 'timestamp', nullable: true})
    createdAt: Date;

    @Column({type: 'timestamp', nullable: true})
    updatedAt: Date;
}
