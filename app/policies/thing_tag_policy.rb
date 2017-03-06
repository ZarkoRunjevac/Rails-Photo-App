class ThingTagPolicy < ApplicationPolicy

  def index?
    true
  end

  def thingtags?
    @user
  end
   def linkable_tags?
    if @user
      #@user.has_role([Role::ORGANIZER], Thing)
      organizer?
    end
    #true
  end

  def create?
    @user && resource_organizer?
  end

  def destroy?
    @user && resource_organizer?
  end

  def linkable_tags?
    @user && resource_organizer?
  end
  def resource_organizer?
    @user.has_role([Role::ORGANIZER], Thing)
  end
  class Scope < Scope
    def resolve
      scope
    end
  end
end
