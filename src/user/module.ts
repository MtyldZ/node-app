import {ModuleBase} from '../module';
import {SessionController} from './session/controller';
import {UserController} from './user/controller';

export class UserModule extends ModuleBase {
    protected initialize(): void {
        this.use('/session', SessionController.create());
        this.use('/user', UserController.create());
    }
}
