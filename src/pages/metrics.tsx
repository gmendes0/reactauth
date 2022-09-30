import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Container,
  Heading,
  Link as ChakraLink,
  Stack,
  Text,
} from "@chakra-ui/react";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import { withSSRAuth } from "../utils/withSSRAuth";

const Metrics: NextPage = () => {
  const { signOut } = useAuth();

  return (
    <>
      <Head>
        <title>Metrics | Auth</title>
      </Head>

      <Container maxW="container.lg" my={20}>
        <Button
          ml="auto"
          display="block"
          colorScheme="purple"
          onClick={signOut}
        >
          Sign Out
        </Button>
        <Heading color="gray.700" textAlign="center" mb={10}>
          Metrics
        </Heading>

        <Breadcrumb color="purple.600" mb={4} fontWeight="500">
          <BreadcrumbItem>
            <Link href="/dashboard" passHref>
              <BreadcrumbLink>Dashboard</BreadcrumbLink>
            </Link>
          </BreadcrumbItem>

          <Link href="/metrics" passHref>
            <BreadcrumbItem>
              <BreadcrumbLink isCurrentPage>Metrics</BreadcrumbLink>
            </BreadcrumbItem>
          </Link>
        </Breadcrumb>

        <Stack spacing={8}>
          <Text textAlign="justify">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sit
            amet eros viverra, viverra libero id, malesuada magna. Proin dictum
            non quam in tincidunt. Aliquam vulputate consectetur neque, vitae
            tempor ante volutpat non. Sed lobortis bibendum luctus. Quisque
            auctor dolor et mauris consequat, ut egestas lorem consectetur. Ut
            ante est, ultrices volutpat rutrum in, suscipit eget metus. Vivamus
            a consectetur justo, vel ultricies libero. Aenean fringilla libero
            at commodo venenatis. Ut magna mauris, tincidunt ac tellus vel,
            convallis vehicula justo. Cras condimentum, arcu eu convallis
            euismod, tortor tellus egestas lorem, vel vulputate ligula velit in
            orci. Nam at sagittis orci, quis rutrum nisi. Lorem ipsum dolor sit
            amet, consectetur adipiscing elit. Curabitur commodo fringilla
            rutrum. Ut dui eros, mollis quis neque in, fringilla ornare augue.
            Mauris tristique quis nibh eget viverra.
          </Text>
          <Text textAlign="justify">
            Fusce turpis ante, laoreet quis tristique sit amet, consectetur
            porta ligula. Integer sed tellus a nibh tincidunt eleifend vitae at
            diam. Curabitur blandit justo nec leo finibus, quis consectetur quam
            molestie. Aliquam eu augue dapibus, porta lacus ut, varius metus.
            Suspendisse potenti. Maecenas laoreet massa a egestas egestas.
            Aenean erat turpis, pretium ac dapibus eget, faucibus nec quam.
            Integer quis porta nisi, ac elementum mauris. Interdum et malesuada
            fames ac ante ipsum primis in faucibus. Donec tempor laoreet nisi ac
            ultrices. Integer porta, velit et feugiat finibus, nibh arcu pretium
            metus, non feugiat sapien ligula a nulla. Vivamus tincidunt sapien
            odio, vel interdum quam feugiat non. Integer vulputate augue at
            libero finibus tincidunt. Maecenas bibendum lobortis sapien a
            pellentesque. Etiam vitae sollicitudin turpis, et consequat urna.
          </Text>
          <Text textAlign="justify">
            Etiam semper purus quis lectus mattis pulvinar. Nam neque orci,
            viverra a augue bibendum, consequat dictum nunc. Nulla facilisi.
            Suspendisse viverra cursus ipsum eget placerat. Curabitur porta
            pellentesque risus. Maecenas consequat, risus a rutrum viverra,
            tellus massa finibus metus, vitae maximus lorem enim ut magna.
            Nullam in pretium nibh. Proin nec arcu quis lacus aliquam
            sollicitudin vel in leo. Ut vel ligula a ligula convallis volutpat.
          </Text>
          <Text textAlign="justify">
            Curabitur dignissim a ex eu semper. Sed eu eleifend augue. Orci
            varius natoque penatibus et magnis dis parturient montes, nascetur
            ridiculus mus. Aliquam lobortis, sem ut tincidunt congue, metus nisl
            venenatis sapien, a pellentesque eros lectus quis nisl. Nam
            efficitur quis leo eu venenatis. Duis pellentesque elementum tortor,
            vitae condimentum mi tincidunt non. Donec ultricies urna nisi, ac
            consequat tellus finibus eget.
          </Text>
          <Text textAlign="justify">
            Quisque pellentesque justo quis tellus gravida, eget rhoncus tortor
            fermentum. Duis sed diam cursus, sollicitudin mi aliquet, ornare
            tortor. Cras eu diam purus. Mauris malesuada semper blandit. Ut
            iaculis vel orci sed venenatis. Integer quis molestie dolor,
            porttitor porttitor eros. Aliquam nunc sem, volutpat vitae
            sollicitudin quis, aliquet vitae ante.
          </Text>
        </Stack>
        <Link href="/dashboard" passHref>
          <ChakraLink color="purple.600" mt={2} display="block">
            Go to dashboard
          </ChakraLink>
        </Link>
      </Container>
    </>
  );
};

export default Metrics;

export const getServerSideProps: GetServerSideProps = withSSRAuth(
  async (context) => ({ props: {} }),
  { permissions: ["metrics.list"], roles: ["administrator", "editor"] }
);
