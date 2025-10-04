
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.userService.findOne(username);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = { id: user.id, username: user.name };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
  async authViaB24(b24Token: string, memberId: string): Promise<{ access_token: string | null }> {
    const res = await fetch('https://mcm-dev.bitrix24.ru/rest/user.current', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + b24Token
      }
    })
    const data = await res.json();
    if (data?.result?.ID) {
      let user = await this.userService.findOneById(data.result.ID);

      if (!user) {
        const insertedUser = await this.userService.save({
          name: data.result.NAME + ' ' + data.result.LAST_NAME,
          password: data.result.XML_ID,
          is_online: false,
          b24_id: data.result.ID,
          b24_member_id: memberId 
        });

        const generatedId = insertedUser.identifiers[0].id;

        user = await this.userService.findOneById(generatedId);
      }


      if (user) {
        const payload = { id: user.id, username: user.name };
        return {
          access_token: await this.jwtService.signAsync(payload),
        };
      }
    }

    return {
      access_token: null,
    };
  }
  async authViaB24Test(user: any): Promise<{ access_token: string | null }> {
    const payload = { id: user.id, username: user.name };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

}

/* BITRIX RESPONSE
{
  "result": {
      "ID": "32",
          "XML_ID": "66026506",
          "ACTIVE": true,
          "NAME": "Гость",
          "LAST_NAME": "Гость",
          "IS_ONLINE": "N",
          "TIME_ZONE": "Europe/Samara",
          "TIMESTAMP_X": "26.09.2025 16:47:47",
          "DATE_REGISTER": "2025-09-01T03:00:00+03:00",
          "PERSONAL_GENDER": "",
          "PERSONAL_BIRTHDAY": "",
          "LAST_ACTIVITY_DATE": "2025-09-29 11:48:23",
          "UF_EMPLOYMENT_DATE": "",
          "UF_DEPARTMENT": [
              1
          ]
      },
      "time": {
          "start": 1759146334,
          "finish": 1759146334.984999,
          "duration": 0.9849989414215088,
          "processing": 0,
          "date_start": "2025-09-29T14:45:34+03:00",
          "date_finish": "2025-09-29T14:45:34+03:00",
          "operating_reset_at": 1759146934,
          "operating": 0
      }
  }
*/
