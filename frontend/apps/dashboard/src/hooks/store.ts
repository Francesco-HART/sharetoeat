import {
	useDispatch,
	useSelector,
	type TypedUseSelectorHook,
} from "react-redux";
import type { AppDispatch, RootState } from "@repo/core/create-store";

export const useAppDispatch = useDispatch<AppDispatch>;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
