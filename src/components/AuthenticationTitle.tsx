"use client";

import { Anchor, Button, List, Container, Group, Paper, PasswordInput, Text, TextInput, Title } from "@mantine/core";
import classes from "./AuthenticationTitle.module.css";
import { useActionState } from "react";
import { handleSubmit } from "@/app/actions/auth";

export function AuthenticationTitle() {
  const [state, action, pending] = useActionState(handleSubmit, undefined)
  
  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        Welcome back!
      </Title>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form action={action}>
          <TextInput
            label="Email"
            placeholder="you@mantine.dev"
            required
            id="email"
            name="email"
          />
          {state?.errors?.email && <Text size="sm" c="red">{state.errors.email}</Text>}
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            id="password"
            name="password"
          />
          {state?.errors?.password && (
            <div>
              <Text c="red">Password must:</Text>
              <List size="sm" c="red">
                {state.errors.password.map((error) => (
                  <List.Item key={error}>- {error}</List.Item>
                ))}
              </List>
            </div>
          )}
          <Group justify="space-around">
            <Button fullWidth mt="xl" type="submit" disabled={pending}>
              {pending ? "Loading..." : "Login"}
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
}
