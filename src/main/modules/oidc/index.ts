const logger = (require('@hmcts/nodejs-logging')).Logger.getLogger('oidc');

import {Application, NextFunction, Request, Response} from 'express';
import fetch, {Response as FetchResponse} from 'node-fetch';
import config from 'config';
import jwt_decode from 'jwt-decode';
import {HttpResponseError} from '../../util/HttpResponseError';

/**
 * Adds the oidc middleware to add oauth authentication
 */
export class OidcMiddleware {

  public enableFor(server: Application): void {
    const loginUrl: string = config.get('services.idam.authorizationURL');
    const tokenUrl: string = config.get('services.idam.tokenURL');
    const clientId: string = config.get('services.idam.clientID');
    const clientSecret: string = config.get('services.idam.clientSecret');
    const redirectUri: string = config.get('services.idam.callbackURL');

    server.get('/login', (req: Request, res) => {
      res.redirect(loginUrl + '?client_id=' + clientId + '&response_type=code&redirect_uri=' + encodeURI(redirectUri));
    });

    server.get('/oauth2/callback', async (req: Request, res: Response) => {

      const params = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
        code: req.query.code as string,
      });

      let response: FetchResponse;
      try {
        response = await fetch(
          tokenUrl,
          {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString(),
          },
        );
      } catch (e) {
        logger.error(e);
        return res.redirect('/');
      }

      try {
        this.checkStatus(response);
      } catch (error) {
        logger.error(error);

        const errorBody = await error.response.text();
        logger.error(`Error body: ${errorBody}`);
        return res.redirect('/');
      }

      const data = await response.json() as Record<string, unknown>;

      req.session.user = data;
      req.session.user.jwt = jwt_decode(data.id_token as string);
      req.session.save(() => res.redirect('/'));
    });

    server.get('/logout', function(req: Request, res){
      req.session.user = undefined;
      req.session.save(() => res.redirect('/'));
    });

    server.use((req: Request, res: Response, next: NextFunction) => {
      if (req.session.user || !config.get('services.idam.enabled')) {
        res.locals.isLoggedIn = true;

        return next();
      }
      res.redirect('/login');
    });

  }

  private checkStatus(response: FetchResponse): FetchResponse {
    if (response.ok) {
      // response.status >= 200 && response.status < 300
      return response;
    } else {
      throw new HttpResponseError(response);
    }
  }

}

declare module 'express-session' {
  export interface SessionData {
    user: Record<string, unknown>
  }
}
