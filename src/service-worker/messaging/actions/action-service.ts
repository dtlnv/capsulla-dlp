import { ServiceWorkerAction } from '@/types/actions';
import { ServiceWorkerActionRegistry } from './action-registry';

export class ServiceWorkerActionService {
    private static instance: ServiceWorkerActionService;
    private registry: ServiceWorkerActionRegistry;

    private constructor(logger?: LoggingService) {
        this.registry = new ServiceWorkerActionRegistry(logger);
    }

    public static getInstance(logger?: LoggingService): ServiceWorkerActionService {
        if (!ServiceWorkerActionService.instance) {
            ServiceWorkerActionService.instance = new ServiceWorkerActionService(logger);
        }
        return ServiceWorkerActionService.instance;
    }

    public async executeAction<R = any>(action: ServiceWorkerAction, data?: any): Promise<ActionResult<R>> {
        return this.registry.execute<R>(action, data);
    }

    public getRegistry(): ServiceWorkerActionRegistry {
        return this.registry;
    }
}

export const actionService = ServiceWorkerActionService.getInstance();
