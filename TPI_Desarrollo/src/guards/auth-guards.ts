import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    //recibir el token y el permiso
    // Logica para conceder el acceso a la ruta 

}
