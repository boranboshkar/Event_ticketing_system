import { useBackofficeNavigator } from "../contexts/BackofficeNavigatorContext";
import Header from "../components/Header";
import NewEventPage from "../pages/BackofficeApp/NewEvent";
import BackofficeCatalogPage from "../pages/BackofficeApp/BackofficeCatalog";
import EventDetailsPage from "../pages/BackofficeApp/EventDetials";
const BackofficeApp = () => {
  const { currentPage } = useBackofficeNavigator();

  let PageComponent;
  switch (currentPage) {
    case "dashboard":
      PageComponent =  <BackofficeCatalogPage /> 
      break;
    case "evetnDetails":
      PageComponent =  <EventDetailsPage /> 
      break;
    case "newEvent":
      PageComponent = <NewEventPage />;
      break;
    default:
      PageComponent =  <BackofficeCatalogPage /> 
  }

  return (
    <>
      <Header />
      {PageComponent}
    </>
  );
};

export default BackofficeApp;
