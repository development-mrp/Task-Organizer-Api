import { IToken } from "./interface";
import { Schema, model } from "mongoose";
/**
 * @openapi
 * definitions:
 *   CreateTokenSchema:
 *     type: object
 *     properties:
 *       token: 
 *         type: string
 *         required: true
 *         example: 'SDDVUDUVBDVSiojidshvfdhv.fdoivndfvbodfvdfkb.offibbufbvfduividfvdfovidfvidjvx' 
 *       expiredAt: 
 *         type: string
 *         required: true
 *         example: '2012-12-12T00:00:00:00Z' 
 *   TokenSchema:
 *     type: object
 *     properties:
 *       token: 
 *         type: string
 *         required: true
 *         example: 'JWT SDDVUDUVBDVSiojidshvfdhv.fdoivndfvbodfvdfkb.offibbufbvfduividfvdfovidfvidjvx'  
 */
const userToken = new Schema<IToken>({
  token: { type: String, required: true},
  createdAt: { type: Date, required: true, default: Date.now },
  expiredAt: { type: Date, required: true, default: Date.now },
});

const UserTokenModel = model<IToken>("Tokens", userToken);

export default UserTokenModel;