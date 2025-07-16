import { createAppAsyncThunk } from "@repo/core/create-app-async-thunk";
import type { AddProperty } from "../ports/property.gateway";
import { determineLegalObligations } from "./determine-property-legal-obligations";

import * as crypto from "node:crypto";

export const addProperty = createAppAsyncThunk(
	"property/create-property",
	async (_, { extra: { propertyGateway }, getState, dispatch }) => {
		const state = getState();
		const id = crypto.randomUUID();
		const formData = state.onboarding.formData;
		const property = state.onboarding.formData.property;
		if (!property) {
			return;
		}
		const command: AddProperty = {
			id,
			email: state.onboarding.formData.email,
			name: property.name,
			type: property.type,
			address: property.address,
			city: property.city,
			postalCode: property.postalCode,
			surface: property.surface,
			constructionYear: property.constructionYear,
			selected: formData.equipements.selected,
			configs: formData.equipements.configs,
			isFurnished: formData.tenant.isFurnished,
			leaseStartDate: formData.tenant.leaseStartDate,
			hasDPE: formData.documents.hasDPE,
		};

		await propertyGateway.createProperty(command);

		dispatch(determineLegalObligations(id));
	},
);
