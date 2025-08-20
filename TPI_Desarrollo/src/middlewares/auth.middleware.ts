import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';
import { response } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers['authorization'];
    const permissions = request.headers['permissions'];
    // console.log("permissions", permissions);
    // console.log("authHeader", authHeader);

    if (!authHeader || !permissions) {
      throw new UnauthorizedException('Token or permissions not provided');
    }
    

    try {
      const response = await axios.get('http://localhost:3000/can-do', {
        headers: {
          Authorization: authHeader,
        },
        params: {
          permissions: permissions
        }
      });

      request.user = response.data;
    } catch (error) {
      console.error('Error validating token:', error);
    }

    return true;


  }
}
