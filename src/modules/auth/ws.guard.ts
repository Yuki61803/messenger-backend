import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { UserService } from "src/modules/user/user.service";
import { AuthService } from "./auth.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { WsException } from "@nestjs/websockets";

@Injectable()
export class WsGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    let token = context.switchToWs().getClient().handshake.query?.access_token;

    try {
      if (token) {
        const payload = await this.jwtService.verifyAsync(
            token,
            {
            secret: this.configService.get('JWT_SECRET')
            }
        );
        client.data.user = payload;
        
        return true;
      } else {
        return false;
      }
    } catch (ex) {
      throw new WsException(ex.message);
    }
  }

  parseCookie(cookieString: string, name: string): string | null {
    const match = cookieString.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) {
      return match[2];
    }
    return null;
  }

  async manualCanActivate(token: string) {
    try {
      if (token) {
        const payload = await this.jwtService.verifyAsync(
            token,
            {
            secret: this.configService.get('JWT_SECRET')
            }
        );
        return payload;
      }
    } catch (ex) {
      console.log(ex.message);
    }
  }
}
