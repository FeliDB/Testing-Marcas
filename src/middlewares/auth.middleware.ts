// delivery/middleware/auth.middleware.ts

import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { Reflector } from '@nestjs/core';
import {JwtService} 

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private reflector:Reflector
  ) {}

async canActivate(context: ExecutionContext): Promise<boolean>{
//       const request: RequestWithUser = context.switchToHttp().getRequest();
//       const token = request.headers.authorization.replace('Bearer ','');
//       if (token == null) {
//         throw new UnauthorizedException('El token no existe');
//       }
//       const payload = this.jwtService.getPayload(token);
//       const user = await this.usersService.findByEmail(payload.email);
//       //AGREGAR LOGICA PARA USAR LOS PERMISOS QUE VIENEN EN EL DECORADOR
//       const permissions = this.reflector.get(Permissions, context.getHandler());
//       //sino  throw Error('')
     
//       return true;
//     } catch (error) {
//       throw new UnauthorizedException(error?.message);
//     }
//   }
}
  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization'];
    if (!token) throw new UnauthorizedException('Falta el token');
    const permission= this.reflector.get(Permissions, context.getHandler());

    try {
      const { data } = await axios.post('http://localhost:3000/can-do/'+permission, {}, {
        headers: { Authorization: token }
      });

      // Si es válido, continuar
      req['user'] = data.user; // opcional, para usar luego
      next();
    } catch (err) {
      throw new UnauthorizedException('Token inválido');
    }
  }
}

// import {
//   CanActivate,
//   ExecutionContext,
//   Injectable,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { Request } from 'express';
// import { UserEntity } from 'src/entities/user.entity';
// import { RequestWithUser } from 'src/interfaces/request-user';
// import { JwtService } from 'src/jwt/jwt.service';
// import { UsersService } from 'src/services/users/users.service';
// import { Permissions } from './decorators/permissions.decorator';

// @Injectable()
// export class AuthGuard implements CanActivate {
//   constructor(
//     private jwtService: JwtService,
//     private usersService: UsersService,
//     private reflector:Reflector
//   ) {}
//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     try {
//       const request: RequestWithUser = context.switchToHttp().getRequest();
//       const token = request.headers.authorization.replace('Bearer ','');
//       if (token == null) {
//         throw new UnauthorizedException('El token no existe');
//       }
//       const payload = this.jwtService.getPayload(token);
//       const user = await this.usersService.findByEmail(payload.email);
//       //AGREGAR LOGICA PARA USAR LOS PERMISOS QUE VIENEN EN EL DECORADOR
//       const permissions = this.reflector.get(Permissions, context.getHandler());
//       //sino  throw Error('')
     
//       return true;
//     } catch (error) {
//       throw new UnauthorizedException(error?.message);
//     }
//   }
// }