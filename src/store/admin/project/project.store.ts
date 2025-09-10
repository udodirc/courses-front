import { ProjectApi } from '../../../api/admin/project/project.api';
import type { Project } from '../../../types/Project';
import type { CreateProjectDto } from '../../../dto/project.dto.ts';
import { BaseStore } from '../../BaseStore';

class ProjectStore extends BaseStore<CreateProjectDto, Project> {
    public storeId = 'admin-project';
    public api = new ProjectApi();
}

const projectStore = new ProjectStore();

type ProjectStoreState = {
    items: Project[];
    item: Project | null;
    loading: boolean;
    error: string;
};
export const useProjectStore = projectStore.getStore(projectStore.api, {
    getProjectList: (state: ProjectStoreState): Project[] =>
        Array.isArray(state.items)
            ? state.items.map(item => ({
                ...item,
                canToggleStatus: true
            }))
            : [],
    currentProject: (state: ProjectStoreState): Project | null => state.item,
});