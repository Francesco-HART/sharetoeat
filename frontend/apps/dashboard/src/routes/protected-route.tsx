import { useEffect, type FC } from "react";
import { Outlet, useNavigate } from "react-router";
import { useAppSelector } from "~/hooks/store";

export const ProtectedRoute: FC = () => {
	const isLoggedIn = useAppSelector((state) => !!state.auth.user);
	const isAuthChecked = useAppSelector((state) => state.auth.isChecked);
	const navigate = useNavigate();

	useEffect(() => {
		if (!isLoggedIn && isAuthChecked) {
			navigate("/auth/login");
		}
	}, [isLoggedIn, isAuthChecked, navigate]);

	return isLoggedIn ? <Outlet /> : null;
};
