// const getDocumentCookie = (cookieName: string): string => {
//     const allCookies = document.cookie || '';
//     const [, cookieValue = ''] =
//       allCookies
//         .split('; ')
//         .map((pair) => pair.split('='))
//         .find(([key]) => key === cookieName) || [];

//     return cookieValue;
// }

// public static isTokenValid(token: DecodedToken): boolean {
//   return (
//     typeof token.sub === 'string' &&
//     token.sub.length > 0 &&
//     token.exp * 1000 > Date.now()
//   );
// }

// private static decodeCookie(cookie: string): DecodedToken {
//   try {
//     const [, payload] = cookie.split('.');
//     return JSON.parse(window.atob(payload));
//   } catch (e) {
//     return {
//       email: '',
//       sub: '',
//       exp: 0,
//       xid: ''
//     };
//   }
// }
// // const [, payload] = getDocumentCookie("pay_ent_pass").split('.');
// // console.log(JSON.parse(window.atob(payload))); 


// export {getDocumentCookie}

interface DecodedToken {
  userName?: string;
  exp: number;
  iat?: number;
}

class UserAuthenticationClient {
  public static getDecodedToken(authCookieName: string): DecodedToken {
    const cookie = this.getCookieValue(authCookieName);
    return this.decodeCookie(cookie);
  }

  public static getDecodedAuthToken(authCookieName: string): DecodedToken {
    let decodedToken = UserAuthenticationClient.getDecodedToken(authCookieName);
    return decodedToken;
  }

  public static isTokenValid(token: DecodedToken): boolean {
    return (
      token.exp * 1000 > Date.now()
    );
  }

  public static getDocumentCookie(cookieName: string): string {
    const allCookies = document.cookie || '';
    const [, cookieValue = ''] =
      allCookies
        .split('; ')
        .map((pair) => pair.split('='))
        .find(([key]) => key === cookieName) || [];

    return cookieValue;
  }

  public static getCookieValue(cookieName: string) {
    try {
      return this.getDocumentCookie(cookieName);
    } catch (err) {
      return '';
    }
  }

  private static decodeCookie(cookie: string): DecodedToken {
    try {
      const [, payload] = cookie.split('.');
      return JSON.parse(window.atob(payload));
    } catch (e) {
      return {
        userName: '',
        exp: 0,
        iat: 0
      };
    }
  }
}

function setCookie(cname: string, cvalue: string, exdays:number) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function removeCookie(cname: string) {
  document.cookie = `${cname}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export {UserAuthenticationClient , setCookie, removeCookie}