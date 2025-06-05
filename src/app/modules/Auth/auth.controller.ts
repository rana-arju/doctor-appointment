import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { authService } from "./auth.service";

const loginUser = catchAsync(async (req, res) => {
  console.log(req.body);
  
  const result = await authService.loginUser(req.body);
  const { accessToken, refreshToken, needPasswordChange } = result;
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Set to true in production
    sameSite: "strict", // Adjust as needed
  });
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User logged in successfully",
    data: {
      accessToken,
      needPasswordChange,
    },
  });
});

const refreshUserToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  
  if (!refreshToken) {
    return sendResponse(res, {
      statusCode: 401,
      success: false,
      message: "Refresh token is missing",
    });
  }

  const result = await authService.refreshUserToken(refreshToken);
  const { accessToken } = result;

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Set to true in production
    sameSite: "strict", // Adjust as needed
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User token refreshed successfully",
    data: {
      accessToken,
      needChangePassword: result.needChangePassword,
    },
  });
});
const passwordChange = catchAsync(async (req, res) => { 
  
  const result = await authService.passwordChange(req.user, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Password changed successfully",
    data: result,
  });
})
const forgetPassword = catchAsync(async (req, res) => { 
  const { email } = req.body;
  await authService.forgetPassword(email);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Password reset link sent successfully",
    data: null,
  });

})
const resetPassword = catchAsync(async (req, res) => { 
  const token = req.headers.authorization || "";
  
  await authService.resetPassword(token, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Password reset succesfull",
    data: null,
  });

})

export const AuthController = {
  loginUser,
  refreshUserToken,
  passwordChange,
  forgetPassword,
  resetPassword,
};
