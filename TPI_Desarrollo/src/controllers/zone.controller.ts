import { Body, Controller, Post, Get, Put, Param, Patch, Delete } from '@nestjs/common';
import { ZoneService } from '../services/zone.service';
import { identity } from 'rxjs';
import { zoneEntity } from 'src/entities/zone.entity';

@Controller('zone')
export class ZoneController {

    constructor(private zoneService: ZoneService){}

    @Post()
    postZone(@Body() body: any){
        return this.zoneService.postZone(body);
    }

    @Get()
    getZones(){
        return this.zoneService.getZones();
    }

    @Get(":id")
    getZone(@Param("id") id: number){
        return this.zoneService.getZone(id);
    }

    @Put(":id")
    putZone(@Param("id") id: number, @Body() body: any){
        return this.zoneService.putZone(id, body);
    }

    @Patch(":id")
    patchZone(@Param("id") id: number, @Body() body: any){
        return this.zoneService.patchZone(id, body);
    }

    @Delete(":id")
    deleteZone(@Param("id") id: number){
        return this.zoneService.deleteZone(id);
    }
}