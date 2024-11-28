
import {
  authRoute,
  cbtModuleRoute,
  cbtQuestionRoute,
  cbtRoute,
  oauthGoogleRoute,
} from "../../server/routes";

export type QuestionClient = typeof cbtQuestionRoute;

export type AuthClient = typeof authRoute;

export type OAuthClient = typeof oauthGoogleRoute;

export type CbtClient = typeof cbtRoute;

export type CbtModuleClient = typeof cbtModuleRoute;

// export const questionClient = hc<QuestionClient>("/api/cbts/:cbtId/modules");
