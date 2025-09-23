import { computed } from 'vue';
import { ProjectApi } from '../../../api/admin/project/project.api';
import type { Project } from '../../../types/Project';
import type { CreateProjectDto } from '../../../dto/project.dto.ts';
import { BaseStore } from '../../BaseStore';

class ProjectStore extends BaseStore<CreateProjectDto, Project> {
    public storeId = 'admin-project';
    public api = new ProjectApi();
}

const projectStore = new ProjectStore();

export const useProjectStore = projectStore.getStore(projectStore.api);

export function useProjectStoreWithGetters() {
    const store = useProjectStore();

    const projectList = computed(() =>
        store.items.map(item => ({
            ...item,
            canToggleStatus: true,
        }))
    );

    const currentProject = computed(() => store.item);

    return {
        ...store,
        projectList,
        currentProject,
    };
}