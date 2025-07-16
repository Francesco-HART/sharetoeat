import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../create-store";

export const Equipements = [
	"boiler",
	"smoke_detector",
	"cheminey",
	"electrical_installation",
] as const;

export type Equipement = (typeof Equipements)[number];

export type ChaudiereConfig = {
	type?: string;
	puissance?: number;
	lastMaintenance?: string;
};

export type ChemineeConfig = {
	hasConduit?: boolean;
	lastSweeping?: string;
};

export type InstallationElectriqueConfig = {
	InstallationDate?: string;
	lastDiagnostic?: string;
};

export type EquipementConfig =
	| ChaudiereConfig
	| ChemineeConfig
	| InstallationElectriqueConfig;

export type PropertyFormData = {
	name: string;
	type: string;
	address: string;
	city: string;
	postalCode: string;
	surface: number;
	constructionYear: number;
};

export type EquipementFormData = {
	selected: Equipement[];
	configs: Partial<Record<Equipement, EquipementConfig>>;
};

export type TenantFormData = {
	isFurnished: boolean;
	name?: string;
	leaseStartDate: string;
};

export type DocumentsFormData = {
	hasDPE: boolean;
	dpeDate?: string;
};

export type OnboardingFormData = {
	property?: PropertyFormData;
	equipements: EquipementFormData;
	tenant: TenantFormData;
	documents: DocumentsFormData;
	email: string;
};

export type OnboardingState = {
	currentStep: number;
	totalSteps: number;
	formData: OnboardingFormData;
};

const initialState: OnboardingState = {
	currentStep: 0,
	totalSteps: 5,
	formData: {
		email: "",
		property: undefined,
		equipements: {
			selected: [],
			configs: {},
		},
		tenant: {
			isFurnished: false,
			name: "",
			leaseStartDate: "",
		},
		documents: {
			hasDPE: false,
			dpeDate: "",
		},
	},
};

export const onboardingSlice = createSlice({
	name: "onboarding",
	initialState,
	reducers: {
		nextStep: (state) => {
			state.currentStep += 1;
		},
		previousStep: (state) => {
			state.currentStep -= 1;
		},
		updateProperty: (state, action: PayloadAction<PropertyFormData>) => {
			state.formData.property = action.payload;
		},
		addEquipements: (state, action: PayloadAction<Equipement>) => {
			const equipmentId = action.payload;

			const selected = state.formData.equipements.selected;

			if (!selected.includes(equipmentId)) {
				state.formData.equipements = {
					...state.formData.equipements,
					selected: [...selected, equipmentId],
				};
			}
		},
		removeEquipments: (state, action: PayloadAction<string>) => {
			const equipmentId = action.payload;
			const selected = state.formData.equipements.selected;

			state.formData.equipements = {
				...state.formData.equipements,
				selected: selected.filter((id) => id !== equipmentId),
			};
		},

		updateEquipementConfig: (
			state,
			action: PayloadAction<{ id: Equipement; config: any }>,
		) => {
			const { id, config } = action.payload;
			state.formData.equipements.configs[id] = {
				...state.formData.equipements.configs[id],
				...config,
			};
		},

		updateEmail: (state, action: PayloadAction<string>) => {
			state.formData.email = action.payload;
		},

		updateTenant: (
			state,
			action: PayloadAction<TenantFormData & DocumentsFormData>,
		) => {
			state.formData.tenant = {
				...state.formData.tenant,
				...action.payload,
			};
			state.formData.documents = {
				...state.formData.documents,
				...action.payload,
			};
		},
	},
});

export const {
	nextStep,
	previousStep,
	updateProperty,
	addEquipements,
	removeEquipments,
	updateEquipementConfig,
	updateTenant,
	updateEmail,
} = onboardingSlice.actions;

export const selectIsLastStep = (state: RootState) =>
	state.onboarding.currentStep === state.onboarding.totalSteps - 1;

export const selectEquipments = (state: RootState) =>
	state.onboarding.formData.equipements.selected;

export const selectHasValidEmail = (state: RootState) => {
	const email = state.onboarding.formData.email;
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};
