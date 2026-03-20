'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { BubblesBackground } from './bubbles-background';
import { loginAction } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function LoginForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error') === 'CredentialsSignin' ? 'Invalid username or password.' : null;

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-black p-10 text-white lg:flex dark:border-r overflow-hidden">
        <BubblesBackground />
        
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          Nufy Inc
        </div>

        <div className="relative z-20 flex flex-col items-center justify-center flex-grow">
          <div className="w-full max-w-[900px] px-10">
            <style jsx>{`
              .logo-path {
                fill: #fff;
                stroke: rgba(255, 255, 255, 0.8);
                fill-opacity: 0;
                stroke-opacity: 1;
                stroke-width: 1.5;
                stroke-dasharray: 1000px;
                stroke-dashoffset: 1000px;
                stroke-linecap: round;
                stroke-linejoin: round;
                animation: draw-text 5s ease-in-out infinite;
              }

              @keyframes draw-text {
                0%, 10% {
                  stroke-dashoffset: 1000px;
                  fill-opacity: 0;
                }
                40%, 70% {
                  stroke-dashoffset: 0;
                  fill-opacity: 0.03;
                  filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.1));
                }
                100% {
                  stroke-dashoffset: 1000px;
                  fill-opacity: 0;
                }
              }
            `}</style>
            <svg viewBox="0 0 1400 250" className="w-full h-auto overflow-visible drop-shadow-2xl">
              <g className="logo-path" fill="none" stroke="white" strokeWidth="2.5">
                {/* A (Center: 100) */}
                <path d="M40,200 L100,50 L160,200 M70,150 L130,150" />
                {/* I (Center: 260, Gap: 160) */}
                <path d="M260,50 L260,200 M230,50 L290,50 M230,200 L290,200" />
                {/* S (Center: 420, Gap: 160) - I와 S 사이 간격 확보 */}
                <path d="M385,50 C455,50 455,100 385,125 C315,150 315,200 385,200 L455,200" />
                {/* T (Center: 580, Gap: 160) */}
                <path d="M530,50 L630,50 M580,50 L580,200" />
                {/* U (Center: 740, Gap: 160) */}
                <path d="M700,50 L700,170 C700,195 780,195 780,170 L780,50" />
                {/* D (Center: 900, Gap: 160) - U와 D 사이 간격 확보 */}
                <path d="M850,50 L850,200 M850,50 C950,50 950,200 850,200" />
                {/* I (Center: 1060, Gap: 160) */}
                <path d="M1060,50 L1060,200 M1030,50 L1090,50 M1030,200 L1090,200" />
                {/* O (Center: 1220, Gap: 160) */}
                <path d="M1170,125 C1170,40 1270,40 1270,125 C1270,210 1170,210 1170,125 Z" />
              </g>
            </svg>
          </div>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
            <p className="text-sm text-muted-foreground">Enter your email below to create your account</p>
          </div>
          <div className="grid gap-6">
            <form action={loginAction}>
              {error && (
                <div className="mb-4 rounded-lg bg-destructive/15 p-3 text-sm text-destructive text-center">
                  {error}
                </div>
              )}
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="id">Email</Label>
                  <Input
                    id="id"
                    name="id"
                    placeholder="name@example.com"
                    type="text"
                    autoCapitalize="none"
                    autoComplete="username"
                    autoCorrect="off"
                    required
                    className="h-10"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="h-10"
                  />
                </div>
                <Button className="w-full h-10 mt-2" type="submit">
                  Sign In with Email
                </Button>
              </div>
            </form>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <Button variant="outline" type="button" className="w-full h-10">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 438.549 438.549" className="mr-2 h-4 w-4">
                <path
                  fill="currentColor"
                  d="M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8-33.598-19.607-70.277-29.408-110.063-29.408-39.781 0-76.472 9.804-110.063 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.854 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.419-1.996 2.475-2.282 3.711-5.14 3.711-8.562 0-.571-.049-5.708-.144-15.417a2549.81 2549.81 0 01-.144-25.406l-6.567 1.136c-4.187.767-9.469 1.092-15.846 1-6.374-.089-12.991-.757-19.842-1.999-6.854-1.231-13.229-4.086-19.13-8.559-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-.951-2.568-2.098-3.711-3.429-1.142-1.331-1.997-2.663-2.568-3.997-.572-1.335-.098-2.43 1.427-3.289 1.525-.859 4.281-1.276 8.28-1.276l5.708.853c3.807.763 8.516 3.042 14.133 6.851 5.614 3.806 10.229 8.754 13.846 14.842 4.38 7.806 9.657 13.754 15.846 17.847 6.184 4.093 12.419 6.136 18.699 6.136 6.28 0 11.704-.476 16.274-1.423 4.565-.952 8.848-2.383 12.847-4.285 1.713-12.758 6.377-22.559 13.988-29.41-10.848-1.14-20.601-2.857-29.264-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.979-3.901-12.374-5.852-26.648-5.852-42.826 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.379-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.283 18.794 7.952 23.84 10.994 5.046 3.041 9.089 5.618 12.135 7.708 17.705-4.947 35.976-7.421 54.818-7.421s37.117 2.474 54.823 7.421l10.849-6.849c7.419-4.57 16.18-8.758 26.262-12.565 10.088-3.805 17.802-4.853 23.134-3.138 8.562 21.509 9.325 40.922 2.279 58.24 15.036 16.18 22.559 35.787 22.559 58.817 0 16.178-1.958 30.497-5.853 42.966-3.9 12.471-8.941 22.457-15.125 29.979-6.191 7.521-13.901 13.85-23.131 18.986-9.232 5.14-18.182 8.85-26.84 11.136-8.662 2.286-18.415 4.004-29.263 5.146 9.894 8.562 14.842 22.077 14.842 40.539v60.237c0 3.422 1.19 6.279 3.572 8.562 2.379 2.279 6.136 2.95 11.276 1.995 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.161 41.825-81.126 41.825-128.906-.01-39.771-9.818-76.454-29.414-110.049z"
                />
              </svg>
              GitHub
            </Button>
          </div>
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{' '}
            <a href="/terms" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LoginForm />
    </Suspense>
  );
}

function LoadingFallback() {
  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
