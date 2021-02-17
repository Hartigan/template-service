import { AuthService } from "./services/AuthService";
import { ExaminationService } from "./services/ExaminationService";
import { FoldersService } from "./services/FoldersService";
import { GroupService } from "./services/GroupService";
import { LoggerService } from "./services/LoggerService";
import { PermissionsService } from "./services/PermissionsService";
import { ProblemSetService } from "./services/ProblemSetService";
import { ProblemsService } from "./services/ProblemsService";
import { UserService } from "./services/UserService";
import { VersionService } from "./services/VersionService";

const logger = new LoggerService();
const authService = new AuthService();
const versionService = new VersionService(authService);
const foldersService = new FoldersService(authService);
const problemsService = new ProblemsService(authService);
const problemSetService = new ProblemSetService(authService);
const permissionsService = new PermissionsService(authService);
const userService = new UserService(authService);
const examinationService = new ExaminationService(authService);
const groupService = new GroupService(authService);

const Services = {
    logger,
    authService,
    versionService,
    foldersService,
    problemsService,
    problemSetService,
    permissionsService,
    userService,
    examinationService,
    groupService
}

export default Services;

