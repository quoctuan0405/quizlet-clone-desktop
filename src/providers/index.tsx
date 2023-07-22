import compose from "compose-function";
import { withRouter } from "./withRouting";

export const withProviders = compose(withRouter);
